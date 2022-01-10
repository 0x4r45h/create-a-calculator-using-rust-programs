import * as anchor from '@project-serum/anchor';
import * as assert from "assert";

const {SystemProgram} = anchor.web3
describe('mycalculatordapp', () => {

  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculatordapp;
  let _calculator;

  it('Creates a calculator', async () => {
      await program.rpc.create("Welcome to Solana",{
        accounts: {
          calculator: calculator.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [calculator]
      });
      const account = await program.account.calculator.fetch(calculator.publicKey);
      assert.ok(account.greeting === "Welcome to Solana");
      _calculator = calculator
  });

  it("Adds two numbers", async function() {
    await program.rpc.calculate("+",new anchor.BN(2), new anchor.BN(4), {
      accounts: {
        calculator: _calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(_calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(6)));
    assert.ok(account.remainder.eq(new anchor.BN(0)));
    assert.ok(account.greeting === "Welcome to Solana");

  });

  it('Multiplies two numbers', async function() {
    await program.rpc.calculate("*",new anchor.BN(2), new anchor.BN(2), {
      accounts: {
        calculator: _calculator.publicKey,
      }
    });
    const account = await program.account.calculator.fetch(_calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(4)));
    assert.ok(account.remainder.eq(new anchor.BN(0)));
    assert.ok(account.greeting === "Welcome to Solana");

  })

  it('Subtracts two numbers', async function() {
    await program.rpc.calculate("-",new anchor.BN(6), new anchor.BN(5), {
      accounts: {
        calculator: _calculator.publicKey,
      }
    });
    const account = await program.account.calculator.fetch(_calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(1)));
    assert.ok(account.remainder.eq(new anchor.BN(0)));
    assert.ok(account.greeting === "Welcome to Solana");
  });

  it('Divides two numbers', async function() {
    await program.rpc.calculate("/",new anchor.BN(7), new anchor.BN(2), {
      accounts: {
        calculator: _calculator.publicKey,
      }
    });
    const account = await program.account.calculator.fetch(_calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(3)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
    assert.ok(account.greeting === "Welcome to Solana");
  });
});
