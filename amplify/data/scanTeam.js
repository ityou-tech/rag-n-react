export function request(ctx) {
  return { operation: 'Scan' };
}

export function response(ctx) {
  return ctx.result.scannedCount;  // Return the items from the scan
}