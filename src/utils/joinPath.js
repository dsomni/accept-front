export const joinPath = (paths) => {
  for (var i = 0; i < paths.length; i++){
    paths[i] = paths[i].split(":")[0]
    paths[i] = paths[i].replace(/^\//, "")
    paths[i] = paths[i].replace(/\/$/, "")
  }
  return paths.join("/")
}
