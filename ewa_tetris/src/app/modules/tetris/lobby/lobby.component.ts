import {Component, OnInit} from '@angular/core';
import {DataService, Game} from "../../../shared/api/generated";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  public games: Game[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getOpenGames().subscribe((games: Game[]) => {
      this.games = games;
    });
  }
}
