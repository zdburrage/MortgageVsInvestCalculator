export class Mortgage {
    loanAmount: number;
    interestRate: number;
    loanTerm: number;
    monthlyPayment: number;
    extraPayment: number;
    totalInterestPaid: number;
    monthsToPayoff: number;
  
    constructor(loanAmount: number, interestRate: number, loanTerm: number, extraPayment: number) {
      this.loanAmount = loanAmount;
      this.interestRate = interestRate / 100 / 12; // convert annual interest rate to monthly
      this.loanTerm = loanTerm;
      this.extraPayment = extraPayment;
      this.monthlyPayment = this.calculateMonthlyPayment();
      this.totalInterestPaid = 0; // initialize total interest paid
      this.monthsToPayoff = 0; // initialize months to payoff
    }
  
    calculateMonthlyPayment(): number {
      let n = this.loanTerm * 12;
      let r = this.interestRate;
      return (this.loanAmount * r * Math.pow((1 + r), n)) / (Math.pow((1 + r), n) - 1);
    }
  
    calculateAmortization(): any[] {
    this.totalInterestPaid = 0;
      let balance = this.loanAmount;
      let amortizationSchedule = [];
      let i = 0;
  
      while(balance > 0) {
        let interestPayment = balance * this.interestRate;
        let principalPayment = this.monthlyPayment - interestPayment + this.extraPayment;
        
        // If the remaining balance is less than the principal payment, adjust it
        if (balance < principalPayment) {
          principalPayment = balance;
        }
  
        balance -= principalPayment;
        this.totalInterestPaid += interestPayment; // add the interest payment to the total
        this.monthsToPayoff = i + 1; // update months to payoff
  
        amortizationSchedule.push({
          month: this.monthsToPayoff,
          principalPayment: principalPayment,
          interestPayment: interestPayment,
          balance: balance,
          totalPayment: principalPayment + interestPayment
        });
        
        i++;
      }
  
      return amortizationSchedule;
    }
  }
  
  