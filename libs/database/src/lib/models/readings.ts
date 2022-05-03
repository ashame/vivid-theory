import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from 'sequelize';

export default class readings extends Model<
  InferAttributes<readings>,
  InferCreationAttributes<readings>
> {
  declare Serial_Number: string; //important
  declare DateTime: Date;
  declare Device_ID: string; //important
  declare Device_Name: string | null;
  declare User_Device_Name: string | null;
  declare Device_Type: string;
  declare Device_Make: string | null;
  declare Device_Model: string | null;
  declare Device_Location: string | null;
  declare Wattage: number; //important
}

export const initSettings = {
  Serial_Number: DataTypes.STRING,
  DateTime: DataTypes.DATE,
  Device_ID: DataTypes.STRING,
  Device_Name: DataTypes.STRING,
  User_Device_Name: DataTypes.STRING,
  Device_Type: DataTypes.STRING,
  Device_Make: DataTypes.STRING,
  Device_Model: DataTypes.STRING,
  Device_Location: DataTypes.STRING,
  Wattage: DataTypes.INTEGER,
};

export const Readings = {
  Model: readings,
  initSettings,
};
