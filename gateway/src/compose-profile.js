const { CUSTOMERS_URL } = require('./config');
const { APIError } = require('./utils/app-errors');
const TIMEOUT_MS = 5000;

const fetchJson = (url, authorization) =>
  fetch(url, {
    headers: authorization ? { Authorization: authorization } : {},
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization;

  const profileResult = await fetchJson(
    `${CUSTOMERS_URL}/customers/profile`,
    authorization
  ).catch((err) => err);

  if (profileResult instanceof Error) {
    return next(
      new APIError(
        'CustomersUnavailable',
        503,
        'Customers service unavailable'
      )
    );
  }

  if (!profileResult.ok) {
    const body = await profileResult.json().catch(() => ({}));

    return next(
      new APIError(
        'CustomersError',
        profileResult.status,
        body.message || 'Customers service error'
      )
    );
  }

  const body = await profileResult.json();
  return res.json(body.data || body);
};
