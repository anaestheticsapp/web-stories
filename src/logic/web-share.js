export default async function webShare(url, opts = {}) {
  const { title, text } = opts;
  if (navigator.share) {
    await navigator.share({ title, text, url }).catch((err) => console.error(err));
  } else {
    console.error('Web share is not supported');
  }
}
