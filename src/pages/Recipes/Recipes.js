import styles from './Recipes.module.css';
import main from '../../components/main.module.css';

export default {
  name: 'Recipes',
  computed: {
    $main() {
      return main;
    },
    $style() {
      return styles;
    }
  }
};