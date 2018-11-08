export function resolveHeaderTitleForRoute({ navigation }) {
  let name;
  const { index } = navigation.state;
  if (index === undefined) {
    name = navigation.state.routeName;
  } else {
    const { routeName } = navigation.state.routes[index];
    name = routeName;
  }
  const headerTitle = name;

  return {
    headerTitle,
  };
}
