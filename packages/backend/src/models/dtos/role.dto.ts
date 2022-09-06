import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false })
  includes?: string[];
}
