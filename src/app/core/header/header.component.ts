import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Account } from 'src/app/_models/account.class';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  showHeader = false;
  currentUser: Account;


  @Output() public sidenavToggle = new EventEmitter();

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private activatedRoute: ActivatedRoute,
    private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
  
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }


}
