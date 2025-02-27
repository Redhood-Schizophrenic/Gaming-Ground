import PocketBase from 'pocketbase';

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://ec2-13-201-29-118.ap-south-1.compute.amazonaws.com:8090/');

// Enable auto refresh of auth tokens
pb.autoCancellation(false);

// Helper to check if user is authenticated
export const isUserValid = () => {
  return pb.authStore.isValid;
};

// Helper to get current user
export const getCurrentUser = () => {
  return pb.authStore.record;
};
