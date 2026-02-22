import styles from './Customers.module.css';
import main from '../../components/main.module.css';

export default {
  name: 'Customers',
  computed: {
    $main() {
      return main;
    },
    $style() {
      return styles;
    }
  }
};