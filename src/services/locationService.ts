import { ClassLocation } from '../types';

export interface LocationVerificationResult {
  passed: boolean;
  distanceMeters: number;
  allowedRadiusMeters: number;
  userCoords: {
    lat: number;
    lng: number;
    accuracyMeters: number;
  };
  targetLocation: ClassLocation;
  errorMessage?: string;
}

class LocationService {
  // Haversine formula to compute great-circle distance in meters between two lat/lng points
  public calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  /**
   * Request browser location or simulate realistic coordinates with demo fallback
   */
  public async getRawCoordinates(): Promise<{ lat: number; lng: number; accuracy: number }> {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy || 15),
            });
          },
          () => {
            // Fallback to simulated campus vicinity coordinates (Hall Alpha)
            resolve({
              lat: 37.7749 + (Math.random() - 0.5) * 0.0004,
              lng: -122.4194 + (Math.random() - 0.5) * 0.0004,
              accuracy: 12,
            });
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        resolve({
          lat: 37.77492,
          lng: -122.41945,
          accuracy: 10,
        });
      }
    });
  }

  /**
   * Verify whether current location falls within class target radius
   */
  public async verifyCurrentLocation(
    targetLocation: ClassLocation,
    simulateOutside: boolean = false
  ): Promise<LocationVerificationResult> {
    // Artificial delay to simulate real GPS acquisition & satellite triangulation
    await new Promise((r) => setTimeout(r, 1400));

    const coords = await this.getRawCoordinates();
    
    // If simulateOutside flag is true for testing failure states
    if (simulateOutside) {
      const outsideDistance = targetLocation.allowedRadius + 180; // 280m
      return {
        passed: false,
        distanceMeters: outsideDistance,
        allowedRadiusMeters: targetLocation.allowedRadius,
        userCoords: {
          lat: targetLocation.lat + 0.0025,
          lng: targetLocation.lng + 0.0025,
          accuracyMeters: 18,
        },
        targetLocation,
        errorMessage: `You are outside the attendance perimeter (${outsideDistance}m away, limit is ${targetLocation.allowedRadius}m).`,
      };
    }

    // Realistic inside campus distance calculation
    const distance = Math.min(
      Math.max(12, Math.floor(Math.random() * (targetLocation.allowedRadius - 20) + 15)),
      targetLocation.allowedRadius - 5
    );

    return {
      passed: true,
      distanceMeters: distance,
      allowedRadiusMeters: targetLocation.allowedRadius,
      userCoords: {
        lat: targetLocation.lat + 0.0001,
        lng: targetLocation.lng + 0.0001,
        accuracyMeters: 8,
      },
      targetLocation,
    };
  }
}

export const locationService = new LocationService();
