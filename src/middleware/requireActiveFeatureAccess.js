export async function requireActiveFeatureAccess(req, res, next) {
  try {
    return next();
  } catch (error) {
    return next(error);
  }
}