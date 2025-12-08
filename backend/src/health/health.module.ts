import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { TypeOrmHealthIndicator } from "./typeorm.health";

@Module({
  imports: [TerminusModule],
  providers: [TypeOrmHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
