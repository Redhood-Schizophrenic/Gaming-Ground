import { pb } from '../pocketbase';

// Base Functions
const handleError = (error) => {
  console.error('API Error:', error);
  throw new Error(error.message);
};

export async function fetchDevices(page = 1, perPage = 50) {
  try {
    return await pb.collection('devices').getList(page, perPage, {
      sort: '-created',
      expand: 'branch_id',
    });
  } catch (error) {
    handleError(error);
  }
}
