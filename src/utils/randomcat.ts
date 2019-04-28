import axios from "axios";

function isValidUrl(url: string): boolean {
  const validExtensions = [".jpg", ".jpeg", ".png"];
  return validExtensions.some((ext) => url.trim().toLowerCase().endsWith(ext));
}

export async function getPictureUrl(): Promise<string> {
  let data;
  do {
    const url = "https://aws.random.cat/meow";
    data = (await axios.get(url)).data;
  } while (!isValidUrl(data.file));
  return `https://i35kgypfrd.execute-api.eu-west-1.amazonaws.com/production/${data.file}`;
}
