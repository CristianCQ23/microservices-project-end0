// The shopping domain has no data of its own yet — orders live embedded in
// CustomerModel (see src/database/models/Customer.js). ShoppingService reaches
// customer data through CustomerService's public methods (GetCart, PlaceOrder),
// not through this repository. Kept as a placeholder for when shopping gets
// its own collection/service.
class ShoppingRepository {}

module.exports = ShoppingRepository;
