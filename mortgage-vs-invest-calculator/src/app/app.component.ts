import { formatNumber } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Investment } from './models/investment';
import { Mortgage } from './models/mortgage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public currentMortgage: Mortgage = new Mortgage(0,0,0,0);
  public newMortgage: Mortgage = new Mortgage(0,0,0,0);
  public investment: Investment = new Investment(0,0,0,0);
  public investmentWithMortgagePayoffTimeline: Investment = new Investment(0,0,0,0);
  public showResults: boolean = false;
  mortgageForm = this.fb.group({
    mortgageBalance: [undefined, Validators.required],
    mortgageInterestRate: [undefined, Validators.required],
    remainingTerm: [undefined, Validators.required],
    expectedReturnRate: [undefined, Validators.required],
    extraMoney: [undefined, Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    const { mortgageBalance, mortgageInterestRate, remainingTerm, expectedReturnRate, extraMoney } = this.mortgageForm.value;

    this.currentMortgage = new Mortgage(mortgageBalance!,mortgageInterestRate!,remainingTerm!,0);
    this.newMortgage = new Mortgage(mortgageBalance!,mortgageInterestRate!,remainingTerm!,extraMoney!);
    this.currentMortgage.calculateAmortization();
    this.newMortgage.calculateAmortization();

    this.investmentWithMortgagePayoffTimeline = new Investment(0,extraMoney!,expectedReturnRate!,this.newMortgage.monthsToPayoff/12);
    this.investmentWithMortgagePayoffTimeline.calculateInvestment();
    this.investment = new Investment(0, extraMoney!, expectedReturnRate!, remainingTerm!);
    this.investment.calculateInvestment();
    this.showResults = true; 
  }


 timeToPayoffMortgageWithInvestment(mortgage: Mortgage, investment: Investment) {
    let actualInvestment = new Investment(investment.initialAmount, investment.monthlyContribution, investment.annualInterestRate * 100,investment.investmentTerm)
    let months = 0;
    let mortgageAmortization = mortgage.calculateAmortization();
    let remainingMortgageBalance = mortgage.loanAmount;
  
    while (remainingMortgageBalance > actualInvestment.totalValue) {
      remainingMortgageBalance = mortgageAmortization[months] ? mortgageAmortization[months].balance : remainingMortgageBalance;
      actualInvestment.calculateMonthlyReturn();
      months++;
    }
  
    return months;
  }
}
