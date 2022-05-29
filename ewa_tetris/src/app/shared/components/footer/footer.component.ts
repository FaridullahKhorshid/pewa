import {Component, OnInit} from '@angular/core';
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {ModalComponent} from "../modal/modal.component";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private modalRef?: MdbModalRef<ModalComponent>;

  public isChatOpen: boolean = false;

  constructor(
    private modalService: MdbModalService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  get isLoggedIn() {
    return this.authService.getToken() != null
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: {
        body: `
    <h4>The goal of Tetris</h4>
    <p>The goal of Tetris is to score the most points by burning rows.
    The game ends when a block touches the top of your screen, so make sure to survive to rack up more points.</p>

    <h4>Points</h4>
    <p>Points are gained by clearing horizontal rows from your grid.
    To clear a row, you need to make sure there is no empty space left in the row. Clearing a row is called ‘burning’. You can burn 1, 2, 3 or 4 rows simultaneously.
    Burning 4 rows at once is called tetris. The more lines you burn at once, the more points will be awarded to you.</p>
    `
      }
    })
  }

}
