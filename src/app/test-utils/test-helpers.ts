import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * Test utility functions for login application
 */
export class TestHelpers {
  
  /**
   * Get element by selector
   */
  static getElement<T extends HTMLElement>(
    fixture: ComponentFixture<any>, 
    selector: string
  ): T | null {
    return fixture.nativeElement.querySelector(selector) as T;
  }

  /**
   * Get debug element by selector
   */
  static getDebugElement(
    fixture: ComponentFixture<any>, 
    selector: string
  ): DebugElement | null {
    return fixture.debugElement.query(By.css(selector));
  }

  /**
   * Simulate user input in text field
   */
  static setInputValue(
    fixture: ComponentFixture<any>, 
    selector: string, 
    value: string
  ): void {
    const input = this.getElement<HTMLInputElement>(fixture, selector);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }
  }

  /**
   * Click button element
   */
  static clickButton(
    fixture: ComponentFixture<any>, 
    selector: string
  ): void {
    const button = this.getElement<HTMLButtonElement>(fixture, selector);
    if (button) {
      button.click();
      fixture.detectChanges();
    }
  }

  /**
   * Mock login credentials for testing
   */
  static readonly MOCK_CREDENTIALS = {
    valid: {
      username: 'testuser',
      password: 'testpass'
    },
    invalid: {
      username: 'wronguser',
      password: 'wrongpass'
    },
    empty: {
      username: '',
      password: ''
    }
  };

  /**
   * Mock server responses
   */
  static readonly MOCK_RESPONSES = {
    success: 'login successful!',
    failure: 'Invalid credentials',
    serverError: 'Server error occurred'
  };

  /**
   * Common selectors for login form
   */
  static readonly SELECTORS = {
    usernameInput: 'input[placeholder="Enter username"]',
    passwordInput: 'input[type="password"]',
    loginButton: 'button',
    messageArea: 'p',
    title: 'h2'
  };
}