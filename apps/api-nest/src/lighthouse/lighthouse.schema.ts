import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema()
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

@Schema()
export class Measure {
  @Prop()
  name: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Score.name }],
  })
  scores: Score[];
}

export type MeasureDocument = HydratedDocument<Measure>;

export const MeasureSchema = SchemaFactory.createForClass(Measure);
