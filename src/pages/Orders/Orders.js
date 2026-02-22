import styles from './Orders.module.css';
// import actions from '../../components/actions.module.css';
import main from '../../components/main.module.css';

export default {
  name: 'Orders',
  computed: {
    $main() {
      return main;
    },
    // $actions() {
    //   return actions
    // },
    $style() {
      return styles;
    }
  }
};