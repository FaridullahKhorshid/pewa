export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './data.service';
import { DataService } from './data.service';
export * from './game.service';
import { GameService } from './game.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [AuthenticationService, DataService, GameService, UserService];
