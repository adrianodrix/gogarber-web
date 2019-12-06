import Reactototron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
import reacttotronSaga from 'reactotron-redux-saga';

if (process.env.NODE_ENV === 'development') {
  const tron = Reactototron.configure()
    .use(reactotronRedux())
    .use(reacttotronSaga())
    .connect();

  tron.clear();

  console.tron = tron;
}
