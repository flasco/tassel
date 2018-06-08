//
//  TestController.m
//  tassel
//
//  Created by Czq on 2018/6/6.
//  Copyright © 2018年 Facebook. All rights reserved.
//
#import "TestController.h"

#import "AppDelegate.h"

#define SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width
#define SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height


@interface TestController ()

@end

@implementation TestController
- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.navigationItem.title = @"我是原生页面哟~";
  
  self.view.backgroundColor = [UIColor whiteColor];
  
  UITextField *zhanghu = [UITextField new];
  [zhanghu setFrame:CGRectMake(0, 30, 200, 50)];
  [zhanghu setPlaceholder:@"请输入账户"];
  [zhanghu resignFirstResponder];
  zhanghu.layer.borderWidth = 1.5f;//边框大小
  zhanghu.layer.cornerRadius = 5;//边框圆角大小
  [zhanghu setValue:[UIColor whiteColor] forKeyPath:@"_placeholderLabel.textColor"];//设置占位字的颜色
  [zhanghu setBackgroundColor:[UIColor clearColor]];//透明效果
  zhanghu.layer.borderColor = [UIColor whiteColor].CGColor;//边框颜色
  
  UIButton *button = [UIButton buttonWithType:(UIButtonTypeCustom)];
  button.frame = CGRectMake(SCREEN_WIDTH / 2 - 150, 80, 150, 40);
  button.backgroundColor = [UIColor redColor];
  [button setTitle:@"登录" forState:(UIControlStateNormal)];
  [button addTarget:self action:@selector(click) forControlEvents:(UIControlEventTouchUpInside)];
  
  UIImageView  *imageView=[[UIImageView alloc] initWithFrame:CGRectMake(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)];
  
  //需要设置图片 UIImage
  
  [imageView setImage:[UIImage imageNamed:@"IndexX.png"]];
  [self.view addSubview:imageView];
  [self.view addSubview:button];
  [self.view addSubview:zhanghu];
}

- (void)click{
  [self.navigationController popToRootViewControllerAnimated:YES];
}

@end
