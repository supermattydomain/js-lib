function compareCells(cell1, cell2) {
  var node1 = findChildByType(cell1, 3);
  var node2 = findChildByType(cell2, 3);
  if (null == node1 || undefined == node1) {
    printMessage('compareCells: no child text to compare');
    printNode(cell1);
    if (null == node2 || undefined == node2) {
      ret = 0;
    } else {
      ret = -1;
    }
  } else if (null == node2 || undefined == node2) {
    printMessage('compareCells: no child text to compare');
    printNode(cell2);
    ret = 1;
  } else {
    ret = compareValues(node1.nodeValue, node2.nodeValue);
  }
  // printMessage('compareCells: returning ' + ret);
  return ret;
}
