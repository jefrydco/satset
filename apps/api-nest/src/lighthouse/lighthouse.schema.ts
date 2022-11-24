import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

const defaultSchemaOptions: SchemaOptions = {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
};

export enum MeasureProgressEnum {
  INIT = 'INIT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Schema(defaultSchemaOptions)
export class Score {
  @Prop()
  jobId: string;

  @Prop()
  performance: number;

  @Prop()
  accessibility: number;

  @Prop()
  bestPractices: number;

  @Prop()
  seo: number;

  @Prop()
  pwa: number;
}

export type ScoreDocument = HydratedDocument<Score>;

export const ScoreSchema = SchemaFactory.createForClass(Score);

@Schema(defaultSchemaOptions)
export class Measure {
  @Prop()
  name: string;

  @Prop()
  runJobId: string;

  @Prop({
    type: String,
    default: MeasureProgressEnum.INIT,
    enum: Object.values(MeasureProgressEnum),
  })
  progress: MeasureProgressEnum;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Score.name }],
  })
  scores: Score[];
}

export type MeasureDocument = HydratedDocument<Measure>;

export const MeasureSchema = SchemaFactory.createForClass(Measure);
