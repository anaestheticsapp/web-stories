export function create(type, o = {}) {
  const elem = document.createElement(type);
  if (o.className) elem.className = o.className;
  if (o.id) elem.id = o.id;
  if (o.attrs) Object.keys(o.attrs).forEach((key) => elem.setAttribute(key, o.attrs[key]));
  if (o.props) Object.keys(o.props).forEach((key) => (elem[key] = o.props[key]));
  if (o.value) elem.value = o.value;
  if (o.text) elem.textContent = o.text;
  if (o.onsubmit) elem.onsubmit = o.onsubmit;
  if (o.parent) o.parent.appendChild(elem);
  return elem;
}
