import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import updateStatus from "../statusDb/updateStatus.js";

export default async function mergeAudioVideo(
  audioPath: string,
  videoPath: string,
  outputPath: string,
  id: string
) {
  try {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);


    await new Promise<void>((resolve, reject) => {
      let percent = 0;
      let totalTime: number = 0;

      // wait
      const i = ffmpeg()
        .input(videoPath)
        .input(audioPath)
        .output(outputPath)
        .withVideoCodec("copy")
        .on("codecData", (data:any) => {
          totalTime = parseInt((data.duration) .replace(/:/g, ""));
        })
        .on("progress", async (progress) => {

          const time = parseInt(progress.timemark.replace(/:/g, ""));

          // AND HERE IS THE CALCULATION
          const cp = (time / totalTime) * 100;
          if (cp - percent > 2) {
            // console.log(percent);
            percent = cp;
            await updateStatus("merging", id, percent);
          }
        })
        .on("end", () => {
          resolve(); // finish
        })
        .on("error", (err) => {
          return reject(new Error("Can't merge audio and video"));
        })
        .run();
    });

    //delete audio and video files

    // console.log(outputPath);
    // console.log(videoPath)
    // console.log(audioPath)

    fs.unlinkSync(audioPath);
    fs.unlinkSync(videoPath);

    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}
