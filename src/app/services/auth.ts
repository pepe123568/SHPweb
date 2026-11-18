
import { HttpClient } from '@angular/common/http';
import { Service, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

interface TokenPayload {
  user?: string;
}

@Service()
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = 'https://fakestoreapi.com/auth/login';

  private storageKey = 'fakestore_token';

  private tokenSignal = signal(
    localStorage.getItem(this.storageKey)
  );

   readonly username = computed(() => {
    const token = this.tokenSignal();
    return token ? this.readUsername(token) : null;
  });
  readonly isAuthenticated = computed(() => this.username() !== null);
  readonly isAdmin = computed(() => this.username() === 'johnd');

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(this.apiUrl, {
      username,
      password
    }).pipe(
      tap((response) => {
        localStorage.setItem(this.storageKey, response.token);
        this.tokenSignal.set(response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.tokenSignal.set(null);
  }

  private readUsername(token: string): string | null {
    try {
      const payload = token.split('.')[1];

      if (!payload) {
        return null;
      }

      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '='
      );

      const data = JSON.parse(atob(padded)) as TokenPayload;

      return data.user ?? null;

    } catch {
      return null;
    }
  }



}
