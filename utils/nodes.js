export function stringToNodes(key, value) {
  const nodes = []
  // toUpperCase()判断大小写  startsWith()判断有没有这个
  if(key.toUpperCase().startsWith(value.toUpperCase())) {
      // 截取输入的文字
      const key1 = key.slice(0, value.length)
      const node1 = {
          name: "span",
          attrs: { style: "color: #26ce8a;" },
          children: [{ type: "text", text: key1 }]
      }
      nodes.push(node1)

      const key2 = key.slice(value.length)
      const node2 = {
          name: "span",
          attrs: { style: "color: #000000;" },
          children: [{ type: "text", text: key2 }]
      }
      nodes.push(node2)
  }else {
      const node = {
          name: "span",
          attrs: { style: "color: #000000;" },
          children: [{ type: "text", text: key }]
      }
      nodes.push(node)
  }
  return nodes
}