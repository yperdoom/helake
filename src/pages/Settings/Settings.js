import styles from './Settings.module.css';
import main from '../../components/main.module.css';

export default {
  name: 'Settings',
  computed: {
    $main() {
      return main;
    },
    $style() {
      return styles;
    }
  }
};