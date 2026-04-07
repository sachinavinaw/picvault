import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface ImageAttributes {
  id: string;
  original_filename: string;
  object_key: string;
  content_type: string;
  size_bytes: number;
  url: string;
  created_at?: Date;
}

type ImageCreationAttributes = Optional<ImageAttributes, "id" | "created_at">;

export class ImageModel
  extends Model<ImageAttributes, ImageCreationAttributes>
  implements ImageAttributes
{
  public id!: string;
  public original_filename!: string;
  public object_key!: string;
  public content_type!: string;
  public size_bytes!: number;
  public url!: string;
  public created_at!: Date;
}

ImageModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    original_filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    object_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size_bytes: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "images",
    timestamps: false,
  },
);
