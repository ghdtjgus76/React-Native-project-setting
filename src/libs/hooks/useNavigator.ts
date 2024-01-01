import {useNavigation} from '@react-navigation/native';

import {StackParamList, BottomTabParamList} from '../../models/navigator';

const useNavigator = () => {
  const stackNavigation = useNavigation<StackParamList>();
  const tabNavigation = useNavigation<BottomTabParamList>();

  return {stackNavigation, tabNavigation};
};

export default useNavigator;
