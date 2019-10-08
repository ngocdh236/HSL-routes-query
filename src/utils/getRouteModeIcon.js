export default route => {
  var icon = '';
  switch (route.mode) {
    case 'BUS':
    case 'SUBWAY':
    case 'TRAM':
      icon = `fas fa-${route.mode.toLowerCase()}`;
      break;
    case 'FERRY':
      icon = 'fas fa-ship';
      break;
    case 'RAIL':
      icon = 'fas fa-train';
      break;

    default:
      break;
  }
  return icon;
};
