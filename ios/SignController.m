//
//  SignController.m
//  tassel
//
//  Created by Czq on 2018/6/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SignController.h"
#import "HTTPHelper.h"
#import "AppDelegate.h"
#import "plistHelper.h"

#define SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width
#define SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height
@interface SignController ()
{
  UITextField *zhanghu;
  UITextField *mima;
}
@end

@implementation SignController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  self.view.backgroundColor = [UIColor whiteColor];
  
  UILabel *label = [UILabel new];
  [label setFrame:CGRectMake(SCREEN_WIDTH / 2 - 120, 20, 240, 38)];
  label.text = @"Tassel";
  label.textAlignment = NSTextAlignmentCenter;
  
  zhanghu = [UITextField new];
  [zhanghu setFrame:CGRectMake(SCREEN_WIDTH / 2 - 120, 120, 240, 36)];
  [zhanghu setPlaceholder:@"请输入账户"];
  
  
  
  zhanghu.backgroundColor = [UIColor colorWithRed:1 green:1 blue:1 alpha:0.6];
  [self setTextFieldLeftPadding:zhanghu forWidth:5.0f];
  
  mima = [UITextField new];
  [mima setFrame:CGRectMake(SCREEN_WIDTH / 2 - 120, 184, 240, 36)];
  [mima setPlaceholder:@"请输入密码"];
  [mima setSecureTextEntry:YES];
  
  mima.backgroundColor = [UIColor colorWithRed:1 green:1 blue:1 alpha:0.6];
  [self setTextFieldLeftPadding:mima forWidth:5.0f];
  
  UIButton *button = [UIButton buttonWithType:(UIButtonTypeCustom)];
  [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
  button.frame = CGRectMake(SCREEN_WIDTH / 2 - 75, 250, 150, 36);
  button.layer.cornerRadius = 4.0f;
  button.backgroundColor = [UIColor colorWithRed:0 green:(180 / 255.0f) blue:(229 / 255.0f) alpha:1];
  [button setTitle:@"注册" forState:(UIControlStateNormal)];
  [button addTarget:self action:@selector(click) forControlEvents:(UIControlEventTouchUpInside)];
  
  UIImageView  *imageView=[[UIImageView alloc] initWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)];
  [imageView setImage:[UIImage imageNamed:@"loginBG.jpg"]];
  [self.view addSubview:imageView];
  [self.view addSubview:button];
  [self.view addSubview:zhanghu];
  [self.view addSubview:mima];
  [self.view addSubview:label];
}


-(void)setTextFieldLeftPadding:(UITextField *)textField forWidth:(CGFloat)leftWidth
{
  CGRect frame = textField.frame;
  frame.size.width = leftWidth;
  UIView *leftview = [[UIView alloc] initWithFrame:frame];
  textField.leftViewMode = UITextFieldViewModeAlways;
  textField.leftView = leftview;
}

-(void) alertx:(NSString*) msg{
  UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"提示"
                                                                 message:msg
                                                          preferredStyle:UIAlertControllerStyleAlert];
  
  UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault
                                                        handler:^(UIAlertAction * action) {
                                                          //响应事件
                                                        }];
  [alert addAction:defaultAction];
  [self presentViewController:alert animated:YES completion:nil];
}


- (void)click{
  [zhanghu resignFirstResponder];
  [mima resignFirstResponder];
  NSDictionary *params = @{@"userName":zhanghu.text,@"password":mima.text  };
  [HTTPHelper postRequestByServiceUrl:@"http://localhost:3000" andApi:@"/sign" andParams:params andCallBack:^(id obj) {
    NSString *status = [NSString stringWithFormat:@"%@", [obj objectForKey:@"success"]];
    NSString *msg = [obj objectForKey:@"msg"];
    if([status isEqualToString:@"0"]){
      dispatch_async(dispatch_get_main_queue(), ^(void){
        [self alertx:msg];
      });
    }else {
      dispatch_async(dispatch_get_main_queue(), ^(void){
        [plistHelper setPlist:@"1"];
        [self.navigationController popToRootViewControllerAnimated:YES];
      });
    }
  }];
  
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
