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
  public investmentReturn: number = 0;
  public mortgagePayment: number = 0;
  public totalInterestPaid: number = 0;
  public interestSaved: number = 0;
  public currentMortgage: Mortgage = new Mortgage(0,0,0,0);
  public newMortgage: Mortgage = new Mortgage(0,0,0,0);
  public investment: Investment = new Investment(0,0,0,0);
  public investmentWithMortgagePayoffTimeline: Investment = new Investment(0,0,0,0);
  mortgageForm = this.fb.group({
    mortgageBalance: [0, Validators.required],
    mortgageInterestRate: [0, Validators.required],
    remainingTerm: [0, Validators.required],
    expectedReturnRate: [0, Validators.required],
    extraMoney: [0, Validators.required]
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
    this.investment.calculateInvestment(); // $10,000 initial amount, $200 monthly contribution, 7% annual interest rate, 10 year term



    // const interestReturnRate = expectedReturnRate! / 100

    // const r = interestReturnRate;
    // const t = remainingTerm!;
    // this.getInvestmentReturn(r!,t!,extraMoney!);
    // this.getInterestSaved(mortgageBalance!, mortgageInterestRate! /100 / 12, remainingTerm! * 12, extraMoney!);
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

  // getMortgagePayment(loanAmount: number, monthlyInterestRate: number, numPayments: number) {
  //   this.mortgagePayment = (loanAmount * monthlyInterestRate * ((1 + monthlyInterestRate) ** numPayments)) / (((1 + monthlyInterestRate) ** numPayments) -1 );
  //   return this.mortgagePayment;
  // }

  // getInvestmentReturn(interestReturnRate: number, remainingTerm: number, monthlySavings: number) {
  //   this.investmentReturn = monthlySavings! * (((1 + interestReturnRate/12)**(12*remainingTerm) - 1) / (interestReturnRate/12));
  // }

  // getTotalMortgageInterest(payment: number, numPayments: number, loanAmount: number) {
  //   return payment * numPayments - loanAmount;
  // }

  // getInterestSaved(loanAmount:number, monthlyInterestRate: number, numPayments: number, extraPayment: number) {
  //   const payment = this.getMortgagePayment(loanAmount,monthlyInterestRate,numPayments);
  //   this.totalInterestPaid = this.getTotalMortgageInterest(payment, numPayments, loanAmount);
  //   const newNumPayments = Math.log((payment - extraPayment) / (payment - loanAmount * monthlyInterestRate)) / Math.log(1 + monthlyInterestRate);
  //   const newInterestPaid = payment * newNumPayments - loanAmount + extraPayment * (newNumPayments - numPayments);
  //   this.interestSaved = this.getTotalMortgageInterest(payment, numPayments, loanAmount) - newInterestPaid;
  // }
}
