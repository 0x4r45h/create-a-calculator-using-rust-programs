use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod mycalculatordapp {
    use super::*;

    pub fn create(ctx: Context<Create>, init_message: String) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        calculator.greeting = init_message;
        Ok(())
    }
    pub fn calculate(ctx:Context<Calculation>, op: String, num1: i64, num2: i64) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = match op.as_str() {
            "+" =>  num1 + num2,
            "-" => num1 - num2,
            "*" => num1 * num2,
            "/" => {
                calculator.remainder = num1 % num2;
                num1 / num2
            },
            _ => panic!()
        };
        Ok(())
    }
}

#[account]
pub struct Calculator {
    pub greeting: String,
    pub result: i64,
    pub remainder: i64,
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 8 + 64 + 64 + 64 + 64)]
    pub calculator: Account<'info, Calculator>,
    #[account(mut)]
    pub user:Signer<'info>,
    pub system_program:Program<'info, System>,
}

#[derive(Accounts)]
pub struct Calculation<'info> {
    #[account(mut)]
    pub calculator: Account<'info, Calculator>,
}

