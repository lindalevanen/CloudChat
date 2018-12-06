export const styles = theme => ({
  view: {
    flex: 1,
    backgroundColor: theme.backdrop,
  },
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 10,
  },
  panel: {
    backgroundColor: theme.foreground,
    borderColor: theme.separator,
    borderBottomWidth: 0.3,
  },
  settingTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginHorizontal: 6,
    width: 30,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
    borderColor: theme.separator,
    borderBottomWidth: 0.3,
  },
  sameSizedChildren: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  section: {
    marginBottom: 18,
  },
  text: {
    fontSize: 16,
    color: theme.text1,
  },
});
