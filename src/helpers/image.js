/**
 * Preload an image, return a promise
 */
export const load = (src, done) => {
  const img = new Image()
  img.onload = () => done(null, img)
  img.onerror = done
  img.src = src
}
