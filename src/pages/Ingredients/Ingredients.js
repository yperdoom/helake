import styles from './Ingredients.module.css';
import main from '../../components/main.module.css';

export default {
  name: 'Ingredients',
  computed: {
    $main() {
      return main;
    },
    $style() {
      return styles;
    }
  }
};