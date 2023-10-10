import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

/*
endpoint: 'https://03436cc6cf076e96702ae26ca015c79e.r2.cloudflarestorage.com', //TODO: replace
  credentials: {
    accessKeyId: '412efddb456afc277727aa4b47583495',
    secretAccessKey: '944359943154f3145077fb86380a8fc4d777d00d8db78bf4277698a6c9930c6d',
  },


 */
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://03436cc6cf076e96702ae26ca015c79e.r2.cloudflarestorage.com`, //TODO: replace
  credentials: {
    accessKeyId: '412efddb456afc277727aa4b47583495',
    secretAccessKey: '944359943154f3145077fb86380a8fc4d777d00d8db78bf4277698a6c9930c6d',
  },
});

async function main() {
  const response = await s3Client.send(
    new PutBucketCorsCommand({
      Bucket: "vids", //TODO: replace
      CORSConfiguration: {
        CORSRules: new Array({
          AllowedHeaders: ["content-type"], //this is important, do not use "*"
          AllowedMethods: ["GET", "PUT", "HEAD"],
          AllowedOrigins: ["*"],
          ExposeHeaders: [],
          MaxAgeSeconds: 3000,
        }),
      },
    })
  );
  console.dir(response)
}

main();
