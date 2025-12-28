// Models
export type { Meal, DailyMacros } from './models/Meal';
export { createMeal } from './models/Meal';
export { MealType } from './models/Meal';

// Services
export { MealService } from './services/MealService';

// Store
export {
  useNutritionStore,
  useMeals,
  useTodayMeals,
  useDailyMacros,
  useNutritionActions,
  useNutritionStatus,
} from './store/nutritionStore';

// Components
export {
  MealForm,
  MealItem,
  MealList,
  DailyMacrosDisplay,
} from './components';
export type { MealFormProps, MealItemProps } from './components';

// Pages
export { NutritionPage } from './pages/NutritionPage';

