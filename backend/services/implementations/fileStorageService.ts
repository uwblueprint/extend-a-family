import { storage } from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";

import IFileStorageService from "../interfaces/fileStorageService";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class FileStorageService implements IFileStorageService {
  bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  async getFile(fileName: string): Promise<string> {
    const bucket = storage().bucket(this.bucketName);
    try {
      const currentBlob = await bucket.file(fileName);
      if (!(await currentBlob.exists())[0]) {
        throw new Error(`File name ${fileName} does not exist`);
      }
      const url = await getDownloadURL(currentBlob);
      return url;
    } catch (error: unknown) {
      Logger.error(
        `Failed to retrieve file. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createFile(
    fileName: string,
    filePath: string,
    contentType: string | null = null,
  ): Promise<void> {
    try {
      const bucket = storage().bucket(this.bucketName);
      const currentBlob = await bucket.file(fileName);
      if ((await currentBlob.exists())[0]) {
        throw new Error(`File name ${fileName} already exists`);
      }
      await bucket.upload(filePath, {
        destination: fileName,
        metadata: { contentType },
      });
    } catch (error: unknown) {
      Logger.error(`Failed to upload file. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateFile(
    fileName: string,
    filePath: string,
    contentType: string | null = null,
  ): Promise<void> {
    try {
      const bucket = storage().bucket(this.bucketName);
      const currentBlob = await bucket.file(fileName);
      if (!(await currentBlob.exists())[0]) {
        throw new Error(`File name ${fileName} does not exist`);
      }
      await bucket.upload(filePath, {
        destination: fileName,
        metadata: { contentType },
      });
    } catch (error: unknown) {
      Logger.error(`Failed to update file. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const bucket = storage().bucket(this.bucketName);
      const currentBlob = await bucket.file(fileName);
      if (!currentBlob) {
        throw new Error(`File name ${fileName} does not exist`);
      }
      await currentBlob.delete();
    } catch (error: unknown) {
      Logger.error(`Failed to delete file. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async uploadImage(
    fileName: string,
    fileData: Buffer | null = null,
    contentType: string | null = null,
  ): Promise<string> {
    try {
      const bucket = storage().bucket(this.bucketName);
      if (fileData) {
        await bucket.file(fileName).save(fileData, {
          metadata: { contentType },
        });
      }
      return await this.getFile(fileName);
    } catch (error: unknown) {
      Logger.error(`Failed to upload file. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default FileStorageService;
