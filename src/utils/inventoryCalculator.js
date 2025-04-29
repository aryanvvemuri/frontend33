import { drinkRecipes, toppingsRecipes, foodRecipes } from './recipes';

export const calculateInventoryUsage = (orders) => {
  const usage = {};

  orders.forEach(order => {
    // Get base recipe
    const recipe = drinkRecipes[order.item] || foodRecipes[order.item];
    if (recipe) {
      Object.entries(recipe).forEach(([ingredient, amount]) => {
        usage[ingredient] = (usage[ingredient] || 0) + amount;
      });
    }

    // Add toppings usage if any
    if (order.toppings) {
      order.toppings.forEach(topping => {
        const toppingRecipe = toppingsRecipes[topping.item];
        if (toppingRecipe) {
          Object.entries(toppingRecipe).forEach(([ingredient, amount]) => {
            usage[ingredient] = (usage[ingredient] || 0) + amount;
          });
        }
      });
    }
  });

  return usage;
};