export class Investment {
    initialAmount: number;
    monthlyContribution: number;
    annualInterestRate: number;
    capitalGainsTaxRate: number;
    investmentTerm: number;
    totalValue: number;
  
    constructor(initialAmount: number, monthlyContribution: number, annualInterestRate: number, investmentTerm: number) {
      this.initialAmount = initialAmount;
      this.monthlyContribution = monthlyContribution;
      this.annualInterestRate = annualInterestRate / 100; // convert to decimal
      this.capitalGainsTaxRate = 0.30; // convert to decimal
      this.investmentTerm = investmentTerm;
      this.totalValue = 0; // initialize total value
    }
  
    calculateInvestment(): number {
      let monthlyInterestRate = this.annualInterestRate / 12;
      let totalMonths = this.investmentTerm * 12;
  
      // calculate the value of the initial amount after the investment term
      let initialAmountValue = this.initialAmount * Math.pow((1 + monthlyInterestRate), totalMonths);
  
      // calculate the value of the monthly contributions after the investment term
      let contributionsValue = this.monthlyContribution * ((Math.pow((1 + monthlyInterestRate), totalMonths) - 1) / monthlyInterestRate);
  
      this.totalValue = initialAmountValue + contributionsValue;
  
      return this.totalValue;
    }

    calculateMonthlyReturn(): number {
        this.totalValue = this.totalValue * (1 + this.annualInterestRate / 12) + this.monthlyContribution;
        return this.totalValue;
    }
    
      calculateCapitalGainsTax(): number {
        let gain = this.totalValue - this.initialAmount;
        return gain > 0 ? gain * this.capitalGainsTaxRate : 0;
    }

    calculateInvestmentGrowth(): any[] {
        this.totalValue = 0;
        let investmentGrowthSchedule = [];
        let months = this.investmentTerm * 12;
    
        for (let i = 0; i < months; i++) {
          let monthlyReturn = this.calculateMonthlyReturn();
          let capitalGainsTax = this.calculateCapitalGainsTax();
          let afterTaxProfit = monthlyReturn - this.initialAmount - capitalGainsTax;
    
          investmentGrowthSchedule.push({
            month: i + 1,
            totalValue: monthlyReturn,
            afterTaxValue: this.initialAmount + afterTaxProfit,
          });
        }
    
        return investmentGrowthSchedule;
      }
  }
  