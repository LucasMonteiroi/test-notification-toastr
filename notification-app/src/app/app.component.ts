import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'notification-app';

  constructor(
    private websocketService: WebsocketService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.websocketService.getMessages().subscribe((msg: any) => {
      const converted = JSON.parse(msg);

      switch (converted.type) {
        case 'success':
          this.toastr.success(converted.content, converted.title);
          break;
        case 'error':
          this.toastr.error(converted.content, converted.title);
          break;
        case 'info':
          this.toastr.info(converted.content, converted.title);
          break;
        case 'warning':
          this.toastr.warning(converted.content, converted.title);
          break;
      }
      console.log(`Message from socket: ${msg}`);
    });
  }
}
