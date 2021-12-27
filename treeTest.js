function ToTree(arr) {
  const result = [];
  const nodeMap = new Map();
  const childrenMap = new Map();
  arr.forEach((obj) => {
    const parentId = obj["parentId"];
    const id = obj["id"];
    if (parentId === id) return;
    const currentChildren = childrenMap.get(id);
    if (currentChildren) {
      obj["children"] = currentChildren;
    }
    nodeMap.set(id, obj);
    if (parentId) {
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        const children = parentNode.children || [];
        children.push(obj);
        parentNode.children = children;
      } else {
        const parentTempChildren = childrenMap.get(parentId) || [];
        parentTempChildren.push(obj);
        childrenMap.set(parentId, parentTempChildren);
      }
    } else {
      result.push(obj);
    }
  });
  console.log(result);
  return result;
}
const list = [
  { id: 1231, parentId: 12 },
  { id: 1231233321312, parentId: 12 },
  { id: 12, parentId: 0 },
  { id: 121312312, parentId: 1231 },
];
ToTree(list)
