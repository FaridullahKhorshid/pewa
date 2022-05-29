/**
 * Ewa tetris Application API
 * This is a Spring Boot RESTful Api for EWA tetris.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { GameUser } from './gameUser';


export interface Game { 
    /**
     * Unique identifier of the Game.
     */
    id: number;
    /**
     * User id who created the game.
     */
    userId: number;
    /**
     * Is the game joinable
     */
    openStatus: boolean;
    /**
     * Game title.
     */
    title: string;
    /**
     * Is a game multi player game or single player
     */
    multiPlayer: boolean;
    /**
     * Is game fished or not
     */
    gameFinished: boolean;
    /**
     * One to Many relationship with Entity GameUser.
     */
    users?: Array<GameUser>;
}

