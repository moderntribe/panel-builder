import raf from 'tempPolyfills';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// Mock envs
global.__DEV__ = false;
global.__TEST__ = true;
